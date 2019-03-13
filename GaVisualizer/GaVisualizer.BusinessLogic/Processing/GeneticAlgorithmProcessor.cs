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
        private static readonly Random Random = new Random();
        private readonly IDictionary<Guid, GeneticAlgorithm> algorithms;

        public GeneticAlgorithmProcessor()
        {
            algorithms = new Dictionary<Guid, GeneticAlgorithm>();
        }

        public Task<Guid> AddNewAlgorithmAsync(BoardSettings settings)
        {
            var id = Guid.NewGuid();
            algorithms.Add(id, new GeneticAlgorithm() { Board = GetRandomBoard(id, false) });

            return Task.FromResult(id);
        }

        public Task<MainBoard> GetCurrentStateAsync(string id)
        {
            var guid = new Guid(id);
            //TODO: implement main algorithm
            if (algorithms.TryGetValue(guid, out GeneticAlgorithm ga))
            {
                //returning random state by each call
                ga.Board = GetRandomBoard(guid);
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
                    
                    if (chance == 1)
                    {
                        board.Cells[i, j] = new Bacteria();
                    }
                    else
                    {
                        board.Cells[i, j] = new Virus();
                    }
                }
            }

            return board;
        }

        //todo: please, find more adequate name
        private void KillNotSatisfiedElements(IBoardElement[,] cells)
        {
            var orderedElements = cells.Cast<IBoardElement>().OrderBy(e => e.FitnessValue);
            var survivalsCount = (cells.GetLength(0) * cells.GetLength(1)) / 2;

            foreach (var elementToKill in orderedElements)
            {
                for (int i = 0; i < cells.GetLength(0); i++)
                {
                    for (int j = 0; j < cells.GetLength(1); j++)
                    {
                        if (cells[i, j] == elementToKill)
                        {
                            cells[i, j] = null;
                        }
                    }
                }
            }
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
                    var nearSimilarElementsCount = GetNearSimilarELementsCount(cells, i, j, elementType, elementsRange);

                    currentElement.FitnessValue = nearSimilarElementsCount * elementMatchRate;
                }
            }
        }

        private int GetNearSimilarELementsCount(IBoardElement[,] cells, int indexX, int indexY, Type elementType, int elemensRange)
        {
            var count = 0;

            for (int i = -indexX; i < indexX; i++)
            {
                for (int j = -indexY; j < indexY; j++)
                {
                    var currentIndexX = indexX - i;
                    var currentIndexY = indexY - j;

                    if (currentIndexX > 0 && currentIndexX > cells.GetLength(0) && currentIndexY > 0 && currentIndexY > cells.GetLength(1))
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
    }
}
