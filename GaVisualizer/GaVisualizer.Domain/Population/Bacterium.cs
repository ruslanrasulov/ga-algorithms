namespace GaVisualizer.Domain.Population
{
    public class Bacterium : IPopulationElement
    {
        public double FitnessValue { get; set; }
        public Gene<double> SocialValue { get; set; }
        public Gene<double> Productivity { get; set; }
        public int Age { get; set; }
        public ElementType ElementType => ElementType.Bacteria;

        public object Clone()
        {
            return new Bacterium
            {
                FitnessValue = FitnessValue,
                SocialValue = SocialValue,
                Productivity = Productivity,
                Age = Age
            };
        }
    }
}
