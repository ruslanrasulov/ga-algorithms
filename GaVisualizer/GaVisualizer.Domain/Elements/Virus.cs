using GaVisualizer.Domain.Board;

namespace GaVisualizer.Domain.Elements
{
    public class Virus : IBoardElement
    {
        public double FitnessValue { get; set; }
        public double SocialValue { get; set; }
        public double Productivity { get; set; }
        public int? Age { get; set; }
        public ElementType ElementType => ElementType.Virus;

        public object Clone()
        {
            return new Virus
            {
                FitnessValue = FitnessValue,
                SocialValue = SocialValue,
                Productivity = Productivity,
                Age = Age
            };
        }
    }
}
