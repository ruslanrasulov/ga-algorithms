namespace GaVisualizer.Domain.Population
{
    public class Bacterium : IPopulationElement
    {
        public double FitnessValue { get; set; }
        public Gene<double> SocialValue { get; set; }
        public Gene<double> Productivity { get; set; }
        public int Age { get; set; }
        public ElementType ElementType => ElementType.Bacteria;

        public int Id { get; set; }
        public int? FirstParentId { get; set; }
        public int? SecondParentId { get; set; }

        public int X { get; set; }
        public int Y { get; set; }
        public int NearSimilarElementsCount { get; set; }

        public object Clone()
        {
            return new Bacterium
            {
                Id = Id,
                FirstParentId = FirstParentId,
                SecondParentId = SecondParentId,
                FitnessValue = FitnessValue,
                SocialValue = SocialValue,
                Productivity = Productivity,
                Age = Age,
                X = X,
                Y = Y
            };
        }
    }
}
