using GaVisualizer.Domain.Evolution;

namespace GaVisualizer.WebApi.Models
{
    public class BoardVm
    {
        public ElementVm[,] Cells { get; set; }
        public int IterationCount { get; set; }
        public CrossoverType CrossoverType { get; set; }
        public SelectionType SelectionType { get; set; }
    }
}
