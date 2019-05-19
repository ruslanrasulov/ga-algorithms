using GaVisualizer.Domain.Evolution;
using GaVisualizer.Domain.Population;

namespace GaVisualizer.Domain.Algorithm
{
    public class AlgorithmSettings
    {
        public int IterationCount { get; set; }
        public CrossoverType CrossoverType { get; set; }
        public SelectionType SelectionType { get; set; }
        public bool InitializeRandomPopulation { get; set; }
        public Generation InitialGeneration { get; set; }
    }
}
