using GaVisualizer.Domain.Board;

namespace GaVisualizer.Domain.Elements
{
    public class Virus : IBoardElement
    {
        public VirusForm Type { get; set; }
        public double Speed { get; set; }
        public double InfectionChanse { get; set; }
        public double InfectionRange { get; set; }
        public double FitnessValue { get; set; }
        public double SocialValue { get; set; }
        public double Productivity { get; set; }
        public Bacterium InfectedBacteria { get; set; }
        public int? Age { get; set; }
        public ElementType ElementType => ElementType.Virus;

        public object Clone()
        {
            return MemberwiseClone();
        }
    }
}
