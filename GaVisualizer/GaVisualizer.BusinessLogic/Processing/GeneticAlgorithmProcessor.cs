using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GaVisualizer.Domain.Algorithm;
using GaVisualizer.Domain.Evolution;
using GaVisualizer.Domain.Population;

namespace GaVisualizer.BusinessLogic.Processing
{
    internal class GeneticAlgorithmProcessor : IGeneticAlgorithmProcessor
    {
        private const double MutationChance = 0.9;
        private const int TournamentGroupSize = 5;

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
                Generations = new List<Generation> { settings.InitialGeneration },
                CurrentState = AlgorithmState.NotStarted,
                SelectionType = settings.SelectionType,
                CrossoverType = settings.CrossoverType
            };

            algorithms.Add(id, algorithm);

            return Task.FromResult(algorithm);
        }

        //TODO: remove after implementing step by step processing
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

                    ProcessAlgorithm(newGeneration.Cells, algorithm.SelectionType, algorithm.CrossoverType);

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

        public Task<GeneticAlgorithm> GetNextStateAsync(string id)
        {
            var guid = new Guid(id);

            if (algorithms.TryGetValue(guid, out var algorithm))
            {
                var lastGeneration = algorithm.Generations.Last();

                switch (algorithm.CurrentState)
                {
                    case AlgorithmState.NotStarted:
                    case AlgorithmState.CalculatingFitnessValue:
                        var newGeneration = lastGeneration.Clone() as Generation;

                        CalculateFitnessValue(newGeneration.Cells);

                        algorithm.CurrentState = AlgorithmState.Selection;
                        algorithm.Generations.Add(newGeneration);
                        break;
                    case AlgorithmState.Selection:
                        var selectedElements = SelectElements(lastGeneration.Cells, algorithm.SelectionType);
                        IncreaseAge(lastGeneration.Cells);

                        algorithm.CurrentState = AlgorithmState.Crossover;
                        algorithm.MetaData = new MetaInformation { SelectedElements = selectedElements };

                        break;
                    case AlgorithmState.Crossover:
                        var newElements = MateElements(lastGeneration.Cells, algorithm.CrossoverType);

                        algorithm.CurrentState = AlgorithmState.Mutation;
                        algorithm.MetaData = new MetaInformation { NewElements = newElements };
                        break;
                    case AlgorithmState.Mutation:
                        var oldGenes = ProcessMutation(lastGeneration.Cells);

                        algorithm.CurrentState = AlgorithmState.CalculatingFitnessValue;
                        algorithm.MetaData = new MetaInformation { OldGenes = oldGenes };
                        break;
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

                    element.Id = Guid.NewGuid();
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
                    var id = Guid.NewGuid();
                    cells[i, j].Id = id;
                    cells[i, j].SocialValue = new Gene<double> { ElementId = id, Value = Random.NextDouble(), GeneType = GeneType.SocialValue };
                    cells[i, j].Productivity = new Gene<double> { ElementId = id, Value = Random.NextDouble(), GeneType = GeneType.Productivity };
                    cells[i, j].Age = 0;
                    cells[i, j].X = i;
                    cells[i, j].Y = j;
                }
            }
        }

        private void ProcessAlgorithm(IPopulationElement[,] cells, SelectionType selectionType, CrossoverType crossoverType)
        {
            CalculateFitnessValue(cells);
            SelectElements(cells, selectionType);
            IncreaseAge(cells);
            MateElements(cells, crossoverType);
            ProcessMutation(cells);
        }

        private IEnumerable<(int x, int y, IPopulationElement)> SelectElements(IPopulationElement[,] cells, SelectionType selectionType)
        {
            switch (selectionType)
            {
                case SelectionType.Proportional:
                    return SelectElementsProportional(cells);
                case SelectionType.Truncation:
                    return SelectElementsByTruncation(cells);
                case SelectionType.Tournament:
                    return SelectElementsByTournament(cells);
                default:
                    throw new ArgumentOutOfRangeException(nameof(SelectionType), $"{selectionType} selection type don't supported");
            }
        }

        private IEnumerable<(int x, int y, IPopulationElement)> SelectElementsByTruncation(IPopulationElement[,] cells)
        {
            var orderedElements = cells.Cast<IPopulationElement>().OrderBy(e => e.FitnessValue);
            var survivalsCount = cells.GetLength(0) * cells.GetLength(1) / 2;
            var killCount = 0;
            var result = new List<(int x, int y, IPopulationElement)>();

            foreach (var elementToKill in orderedElements)
            {
                for (int i = 0; i < cells.GetLength(0); i++)
                {
                    for (int j = 0; j < cells.GetLength(1); j++)
                    {
                        if (killCount > survivalsCount)
                        {
                            return result;
                        }

                        if (cells[i, j] == elementToKill)
                        {
                            killCount++;
                            result.Add((i, j, cells[i, j]));
                            cells[i, j] = null;
                        }
                    }
                }
            }

            return result;
        }

        private IEnumerable<(int x, int y, IPopulationElement)> SelectElementsByTournament(IPopulationElement[,] cells)
        {
            var flattenCells = cells.Cast<IPopulationElement>().ToList();
            var result = new List<IPopulationElement>();
            var survivalsCount = TournamentGroupSize / 2;

            for (int i = 0; i < flattenCells.Count / TournamentGroupSize; i++)
            {
                var notSurvivedCellsInGroup = flattenCells
                    .Skip(i * TournamentGroupSize)
                    .Take(TournamentGroupSize)
                    .OrderBy(e => e.FitnessValue)
                    .Take(survivalsCount);
    
                result.AddRange(notSurvivedCellsInGroup);
            }

            result.ForEach(c => cells[c.X, c.Y] = null);

            return result.Select(c => (c.X, c.Y, c));
        }

        private IEnumerable<(int x, int y, IPopulationElement)> SelectElementsProportional(IPopulationElement[,] cells)
        {
            var flattenCells = cells.Cast<IPopulationElement>().ToList();
            var result = new List<IPopulationElement>();
            var avgFitnessValue = flattenCells.Sum(c => c.FitnessValue) / flattenCells.Count;

            foreach (var cell in flattenCells)
            {
                var fitnessValueRatio = cell.FitnessValue / avgFitnessValue;

                if (fitnessValueRatio < 1)
                {
                    cells[cell.X, cell.Y] = null;
                    result.Add(cell);
                }
            }

            return result.Select(c => (c.X, c.Y, c));
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

        private IEnumerable<IPopulationElement> MateElements(IPopulationElement[,] cells, CrossoverType crossoverType)
        {
            var newCells = new List<(int x, int y, IPopulationElement element)>();

            for (int i = 0; i < cells.GetLength(0); i++)
            {
                for (int j = 0; j < cells.GetLength(1); j++)
                {
                    if (cells[i, j] == null)
                    {
                        var parents = FindParents(cells, i, j);
                        var randomParent = parents[Random.Next(parents.Count)];

                        var child = (IPopulationElement)randomParent.element.Clone();

                        child.Id = Guid.NewGuid();

                        var firstParent = parents[0].element;
                        var secondParent = parents.Count > 1 ? parents[1].element : parents[0].element;

                        child.FirstParentId = firstParent.Id;
                        child.SecondParentId = secondParent?.Id;
                        child.FitnessValue = 0;
                        child.Age = 0;
                        child.X = i;
                        child.Y = j;

                        var (productivity, socialValue) = SelectGenes(firstParent, secondParent, child, crossoverType);

                        child.Productivity = productivity;
                        child.SocialValue = socialValue;

                        newCells.Add((i, j, child));
                    }
                }
            }

            newCells.ForEach(c => cells[c.x, c.y] = c.element);
            return newCells.Select(c => c.element);
        }

        private (Gene<double> productivity, Gene<double> socialValue) SelectGenes(
            IPopulationElement firstParent,
            IPopulationElement secondParent,
            IPopulationElement childElement,
            CrossoverType crossoverType)
        {
            var productivity = new Gene<double>
            {
                GeneType = GeneType.Productivity,
                ElementId = childElement.Id
            };
            var socialValue = new Gene<double>
            {
                GeneType = GeneType.SocialValue,
                ElementId = childElement.Id
            };

            switch (crossoverType)
            {
                case CrossoverType.Point:
                case CrossoverType.MultiplePoint:
                case CrossoverType.Flat:
                    productivity.ParentId = firstParent.Id;
                    productivity.Value = firstParent.Productivity.Value;
                    socialValue.ParentId = secondParent.Id;
                    socialValue.Value = secondParent.SocialValue.Value;
                    break;
                case CrossoverType.DoublePoint:
                    productivity.ParentId = secondParent.Id;
                    productivity.Value = secondParent.Productivity.Value;
                    socialValue.ParentId = firstParent.Id;
                    socialValue.Value = firstParent.SocialValue.Value;
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(crossoverType), $"{crossoverType} crossover type don't supported");
            }

            return (productivity, socialValue);
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

            var orderedParents = parents
                .OrderBy(p => p.range)
                .ThenBy(p => p.element.Productivity.Value);

            var elementType = orderedParents.First().element.ElementType;

            return orderedParents.Where(p => p.element.ElementType == elementType)
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

                    currentElement.FitnessValue = nearSimilarElementsCount * elementMatchRate * currentElement.SocialValue.Value * currentElement.Productivity.Value;
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

        public IEnumerable<Gene<double>> ProcessMutation(IPopulationElement[,] cells)
        {
            var oldGenes = new List<Gene<double>>();

            for (int i = 0; i < cells.GetLength(0); i++)
            {
                for (int j = 0; j < cells.GetLength(1); j++)
                {
                    if (Random.NextDouble() > MutationChance)
                    {
                        var mutatedGene = new Gene<double>
                        {
                            ElementId = cells[i, j].Id,
                            IsMutated = true,
                            Value = Random.NextDouble()
                        };

                        Gene<double> oldGene;

                        if (Random.Next(1) == 1)
                        {
                            oldGene = cells[i, j].Productivity;
                            mutatedGene.GeneType = GeneType.Productivity;
                            cells[i, j].Productivity = mutatedGene;
                        }
                        else
                        {
                            oldGene = cells[i, j].SocialValue;
                            mutatedGene.GeneType = GeneType.SocialValue;
                            cells[i, j].SocialValue = mutatedGene;
                        }

                        oldGenes.Add(oldGene);
                    }
                }
            }

            return oldGenes;
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
