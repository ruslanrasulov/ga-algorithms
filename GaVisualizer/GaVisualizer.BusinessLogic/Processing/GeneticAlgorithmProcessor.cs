using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GaVisualizer.BusinessLogic.Algorithm;
using GaVisualizer.Domain.Board;
using GaVisualizer.Domain.Elements;

namespace GaVisualizer.BusinessLogic.Processing
{
    internal class GeneticAlgorithmProcessor : IGeneticAlgorithmProcessor
    {
        private const double MutationChance = 0.9;

        private static readonly Random Random = new Random();
        private readonly IDictionary<Guid, GeneticAlgorithm> algorithms;

        public GeneticAlgorithmProcessor()
        {
            algorithms = new Dictionary<Guid, GeneticAlgorithm>();
        }

        public Task<Guid> AddNewAlgorithmAsync(BoardSettings settings)
        {
            var id = Guid.NewGuid();
            var algorithm = new GeneticAlgorithm
            {
                Board = settings.Board ?? GetRandomBoard(id, fillBoard: false)
            };

            algorithms.Add(id, algorithm);

            return Task.FromResult(id);
        }

        public Task<MainBoard> GetCurrentStateAsync(string id)
        {
            var guid = new Guid(id);

            //TODO: implement main algorithm
            if (algorithms.TryGetValue(guid, out GeneticAlgorithm ga))
            {
                if (ga.Board.Cells == null)
                {
                    ga.Board = GetRandomBoard(guid, fillBoard: true);
                }
                else
                {
                    ProcessAlgorithm(ga.Board.Cells);
                }

                return Task.FromResult(ga.Board);
            }

            return Task.FromResult((MainBoard)null);
        }

        public Task<IEnumerable<MainBoard>> GetAlgorithmsAsync()
        {
            return Task.FromResult(algorithms.Values.Select(v => v.Board));
        }

        public Task RemoveAsync(string id)
        {
            algorithms.Remove(new Guid(id));

            return Task.CompletedTask;
        }

        public Task StopAsync(string id)
        {
            var guid = new Guid(id);

            if (algorithms.TryGetValue(guid, out var algorithm))
            {
                algorithm.Board.Cells = null;
            }

            return Task.CompletedTask;
        }

        private MainBoard GetRandomBoard(Guid? id = null, bool fillBoard = true)
        {
            var algorithmId = id ?? Guid.NewGuid();

            if (!fillBoard) return new MainBoard() { AlgorithmId = algorithmId };

            var board = new MainBoard()
            {
                AlgorithmId = algorithmId,
                Cells = new IBoardElement[20, 20]
            };

            for (int i = 0; i < board.Cells.GetLength(0); i++)
            {
                for (int j = 0; j < board.Cells.GetLength(1); j++)
                {
                    var chance = Random.Next(2);
                    var socialValue = Random.NextDouble();
                    var selectivity = Random.NextDouble();

                    IBoardElement element;

                    if (chance == 1)
                    {
                        element = new Bacterium();
                    }
                    else
                    {
                        element = new Virus();
                    }

                    element.SocialValue = socialValue;
                    element.Productivity = selectivity;

                    board.Cells[i, j] = element;
                }
            }

            return board;
        }

        private void ProcessAlgorithm(IBoardElement[,] cells)
        {
            CalculateFitnessValue(cells);
            KillNotSatisfiedElements(cells);
            MateElements(cells);
            ProcessMutation(cells);
        }

        //todo: please, find more adequate name
        private void KillNotSatisfiedElements(IBoardElement[,] cells)
        {
            var orderedElements = cells.Cast<IBoardElement>().OrderBy(e => e.FitnessValue);
            var survivalsCount = cells.GetLength(0) * cells.GetLength(1) / 2;

            var killCount = 0;

            foreach (var elementToKill in orderedElements)
            {
                for (int i = 0; i < cells.GetLength(0); i++)
                {
                    for (int j = 0; j < cells.GetLength(1); j++)
                    {
                        if (killCount > survivalsCount)
                        {
                            return;
                        }

                        if (cells[i, j] == elementToKill)
                        {
                            killCount++;
                            cells[i, j] = null;
                        }
                    }
                }
            }
        }

        private void MateElements(IBoardElement[,] cells)
        {
            for (int i = 0; i < cells.GetLength(0); i++)
            {
                for (int j = 0; j < cells.GetLength(1); j++)
                {
                    if (cells[i, j] == null)
                    {
                        var parents = FindParents(cells, i, j);
                        var randomParent = parents[Random.Next(parents.Count)];

                        var child = (IBoardElement)randomParent.Clone();
                        child.SocialValue = (parents[0].SocialValue + parents[1].SocialValue) / 2;

                        cells[i, j] = randomParent;
                    }
                }
            }
        }

        private IReadOnlyList<IBoardElement> FindParents(IBoardElement[,] cells, int indexX, int indexY)
        {
            var parents = new List<(IBoardElement element, int range)>();

            for (int i = 0; i < cells.GetLength(0); i++)
            {
                for (int j = 0; j < cells.GetLength(1); j++)
                {
                    if (i != indexX && j != indexY && cells[i, j] != null)
                    {
                        var range = Math.Abs(i - indexX) + Math.Abs(j - indexY);
                        parents.Add((cells[i, j], range));
                    }
                }
            }

            return parents
                .OrderBy(p => p.range)
                .ThenBy(p => p.element.Productivity) //change to productivity
                .Select(p => p.element)
                .Take(2)
                .ToList();
        }

        private void CalculateFitnessValue(IBoardElement[,] cells)
        {
            const int elementsRange = 3;
            const double elementMatchRate = 0.5;

            for (int i = 0; i < cells.GetLength(0); i++)
            {
                for (int j = 0; j < cells.GetLength(1); j++)
                {
                    var currentElement = cells[i, j];
                    var elementType = currentElement.GetType();
                    var nearSimilarElementsCount = GetNearSimilarElementsCount(cells, i, j, elementType, elementsRange);

                    currentElement.FitnessValue = nearSimilarElementsCount * elementMatchRate * currentElement.SocialValue;
                }
            }
        }

        private int GetNearSimilarElementsCount(IBoardElement[,] cells, int indexX, int indexY, Type elementType, int elementsRange)
        {
            var count = 0;

            for (int i = -indexX - elementsRange; i < indexX + elementsRange; i++)
            {
                for (int j = -indexY; j < indexY; j++)
                {
                    var currentIndexX = indexX - i;
                    var currentIndexY = indexY - j;

                    if (currentIndexX > 0 && currentIndexX < cells.GetLength(0) && currentIndexY > 0 && currentIndexY < cells.GetLength(1))
                    {
                        var currentElement = cells[currentIndexX, currentIndexY];

                        if (currentElement.GetType() == elementType)
                        {
                            count++;
                        }
                    }
                }
            }

            return count;
        }

        public void ProcessMutation(IBoardElement[,] cells)
        {
            for (int i = 0; i < cells.GetLength(0); i++)
            {
                for (int j = 0; j < cells.GetLength(1); j++)
                {
                    if (Random.NextDouble() > MutationChance)
                    {
                        cells[i, j].Productivity = Random.NextDouble();
                        cells[i, j].SocialValue = Random.NextDouble();
                    }
                }
            }
        }
    }
}
