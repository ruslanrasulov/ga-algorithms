using GaVisualizer.Domain.Evolution;

namespace GaVisualizer.WebApi.Models
{
    public class AlgorithmSettingsVm
    {
        public GenerationVm Generation { get; set; }
        public bool InitializeRandomPopulation { get; set; }
        public int IterationCount { get; set; }
        public CrossoverType CrossoverType { get; set; }
        public SelectionType SelectionType { get; set; }
    }
}
