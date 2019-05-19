using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GaVisualizer.Domain.Algorithm;
using GaVisualizer.Domain.Population;

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

        public Task<GeneticAlgorithm> AddNewAlgorithmAsync(AlgorithmSettings settings)
        {
            var id = Guid.NewGuid();

            if (settings.InitializeRandomPopulation)
            {
                settings.InitialGeneration = GetRandomGeneration();
            }
            else
            {
                if (settings.InitialGeneration == null)
                {
                    throw new ArgumentException("Board should be initialized", nameof(settings.InitialGeneration));
                }

                FillBoard(settings.InitialGeneration.Cells);
            }

            var algorithm = new GeneticAlgorithm
            {
                Id = id,
                Generations = new List<Generation> { settings.InitialGeneration }
            };

            algorithms.Add(id, algorithm);

            return Task.FromResult(algorithm);
        }

        public Task<GeneticAlgorithm> GetCurrentStateAsync(string id)
        {
            var guid = new Guid(id);

            if (algorithms.TryGetValue(guid, out GeneticAlgorithm algorithm))
            {
                if (algorithm.IsStopped)
                {
                    Reset(algorithm);
                    Start(algorithm);
                }
                else
                {
                    var newGeneration = algorithm.Generations.Last().Clone() as Generation;

                    ProcessAlgorithm(newGeneration.Cells);

                    if (CheckForStop(newGeneration))
                    {
                        Stop(algorithm);
                    }
                    else if (!algorithm.IsStarted)
                    {
                        Start(algorithm);
                    }

                    algorithm.Generations.Add(newGeneration);
                }

                return Task.FromResult(algorithm);
            }

            return Task.FromResult(default(GeneticAlgorithm));
        }

        public Task<IEnumerable<GeneticAlgorithm>> GetAlgorithmsAsync()
        {
            return Task.FromResult(algorithms.Values.Select(v => v));
        }

        public Task RemoveAsync(string id)
        {
            algorithms.Remove(new Guid(id));

            return Task.CompletedTask;
        }

        public Task<GeneticAlgorithm> StopAsync(string id)
        {
            var guid = new Guid(id);

            if (algorithms.TryGetValue(guid, out var algorithm))
            {
                Stop(algorithm);
                Reset(algorithm);

                return Task.FromResult(algorithm);
            }

            return Task.FromResult(default(GeneticAlgorithm));
        }

        private Generation GetRandomGeneration()
        {
            var board = new Generation()
            {
                Cells = new IPopulationElement[20, 20]
            };

            for (int i = 0; i < board.Cells.GetLength(0); i++)
            {
                for (int j = 0; j < board.Cells.GetLength(1); j++)
                {
                    var chance = Random.Next(2);
                    var socialValue = Random.NextDouble();
                    var productivity = Random.NextDouble();

                    IPopulationElement element;

                    if (chance == 1)
                    {
                        element = new Bacterium();
                    }
                    else
                    {
                        element = new Virus();
                    }

                    element.SocialValue = new Gene<double> { Value = socialValue };
                    element.Productivity = new Gene<double> { Value = productivity };
                    element.Age = 0;

                    board.Cells[i, j] = element;
                }
            }

            return board;
        }

        private void FillBoard(IPopulationElement[,] cells)
        {
            for (int i = 0; i < cells.GetLength(0); i++)
            {
                for (int j = 0; j < cells.GetLength(1); j++)
                {
                    cells[i, j].SocialValue = new Gene<double> { Value = Random.NextDouble() };
                    cells[i, j].Productivity = new Gene<double> { Value = Random.NextDouble() };
                    cells[i, j].Age = 0;
                }
            }
        }

        private void ProcessAlgorithm(IPopulationElement[,] cells)
        {
            CalculateFitnessValue(cells);
            KillNotSatisfiedElements(cells);
            IncreaseAge(cells);
            MateElements(cells);
            ProcessMutation(cells);
        }

        //todo: please, find more adequate name
        private void KillNotSatisfiedElements(IPopulationElement[,] cells)
        {
            var orderedElements = cells.Cast<IPopulationElement>().OrderBy(e => e.FitnessValue);
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

        private void IncreaseAge(IPopulationElement[,] cells)
        {
            for (int i = 0; i < cells.GetLength(0); i++)
            {
                for (int j = 0; j < cells.GetLength(1); j++)
                {
                    if (cells[i, j] != null)
                    {
                        cells[i, j].Age++;
                    }
                }
            }
        }

        private void MateElements(IPopulationElement[,] cells)
        {
            for (int i = 0; i < cells.GetLength(0); i++)
            {
                for (int j = 0; j < cells.GetLength(1); j++)
                {
                    if (cells[i, j] == null)
                    {
                        var parents = FindParents(cells, i, j);
                        var randomParent = parents[Random.Next(parents.Count)];

                        var child = (IPopulationElement)randomParent.element.Clone();

                        child.SocialValue = new Gene<double>
                        {
                            Value = parents[0].element.SocialValue.Value,
                            ParentX = parents[0].x,
                            ParentY = parents[0].y
                        };

                        child.Productivity = new Gene<double>
                        {
                            Value = parents[1].element.Productivity.Value,
                            ParentX = parents[1].x,
                            ParentY = parents[1].y
                        };

                        child.FitnessValue = 0;
                        child.Age = 0;

                        cells[i, j] = child;
                    }
                }
            }
        }

        private IReadOnlyList<(IPopulationElement element, int x, int y)> FindParents(IPopulationElement[,] cells, int indexX, int indexY)
        {
            var parents = new List<(IPopulationElement element, int x, int y, int range)>();

            for (int i = 0; i < cells.GetLength(0); i++)
            {
                for (int j = 0; j < cells.GetLength(1); j++)
                {
                    if (i != indexX && j != indexY && cells[i, j] != null)
                    {
                        var range = Math.Abs(i - indexX) + Math.Abs(j - indexY);
                        parents.Add((cells[i, j], i, j, range));
                    }
                }
            }

            return parents
                .OrderBy(p => p.range)
                .ThenBy(p => p.element.Productivity.Value)
                .Take(2)
                .Select(p => (p.element, p.x, p.y))
                .ToList();
        }

        private void CalculateFitnessValue(IPopulationElement[,] cells)
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

                    currentElement.FitnessValue = nearSimilarElementsCount * elementMatchRate * currentElement.SocialValue.Value;
                }
            }
        }

        private int GetNearSimilarElementsCount(IPopulationElement[,] cells, int indexX, int indexY, Type elementType, int elementsRange)
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

        public void ProcessMutation(IPopulationElement[,] cells)
        {
            for (int i = 0; i < cells.GetLength(0); i++)
            {
                for (int j = 0; j < cells.GetLength(1); j++)
                {
                    if (Random.NextDouble() > MutationChance)
                    {
                        var mutatedGene = new Gene<double>
                        {
                            IsMutated = true,
                            Value = Random.NextDouble()
                        };

                        if (Random.Next(1) == 1)
                        {
                            cells[i, j].Productivity = mutatedGene;
                        }
                        else
                        {
                            cells[i, j].SocialValue = mutatedGene;
                        }
                    }
                }
            }
        }

        private bool CheckForStop(Generation generation)
        {
            var elementTypes = generation.Cells.Cast<IPopulationElement>().Select(e => e.ElementType);

            return elementTypes.All(e => e == ElementType.Bacteria) || elementTypes.All(e => e == ElementType.Virus);
        }

        private void Reset(GeneticAlgorithm algorithm)
        {
            var firstGeneration = algorithm.Generations.First();

            algorithm.Generations.Clear();
            algorithm.Generations.Add(firstGeneration);

            foreach (var element in firstGeneration.Cells.Cast<IPopulationElement>())
            {
                element.Age = 0;
            }
        }

        private void Start(GeneticAlgorithm algorithm)
        {
            algorithm.IsPaused = false;
            algorithm.IsStopped = false;
            algorithm.IsStarted = true;
        }

        private void Stop(GeneticAlgorithm algorithm)
        {
            algorithm.IsPaused = false;
            algorithm.IsStarted = false;
            algorithm.IsStopped = true;
        }
    }
}
