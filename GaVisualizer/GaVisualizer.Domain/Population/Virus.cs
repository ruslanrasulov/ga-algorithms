using System;

namespace GaVisualizer.Domain.Population
{
    public class Virus : IPopulationElement
    {
        public double FitnessValue { get; set; }
        public Gene<double> SocialValue { get; set; }
        public Gene<double> Productivity { get; set; }
        public int Age { get; set; }
        public Guid Id { get; set; }
        public Guid? FirstParentId { get; set; }
        public Guid? SecondParentId { get; set; }

        public ElementType ElementType => ElementType.Virus;

        public int X { get; set; }
        public int Y { get; set; }

        public object Clone()
        {
            return new Virus
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
