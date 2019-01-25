using GaVisualizer.Domain.Board;

namespace GaVisualizer.Domain.Elements
{
    public class Virus : IBoardElement
    {
        public VirusForm Type { get; set; }
        public double Speed { get; set; }
        public double InfectionChanse { get; set; }
        public double InfectionRange { get; set; }
        public Bacteria InfectedBacteria { get; set; }
    }
}
