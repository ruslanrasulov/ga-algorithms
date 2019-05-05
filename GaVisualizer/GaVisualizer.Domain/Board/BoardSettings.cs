using GaVisualizer.Domain.Evolution;

namespace GaVisualizer.Domain.Board
{
    public class BoardSettings
    {
        public int IterationCount { get; set; }
        public CrossoverType CrossoverType { get; set; }
        public SelectionType SelectionType { get; set; }
        public bool CreateRandomBoard { get; set; }
        public MainBoard Board { get; set; }
    }
}
