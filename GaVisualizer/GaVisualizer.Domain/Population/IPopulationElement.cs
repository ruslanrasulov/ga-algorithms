using System;

namespace GaVisualizer.Domain.Population
{
    public interface IPopulationElement : ICloneable
    {
        int Id { get; set; }
        int? FirstParentId { get; set; }
        int? SecondParentId { get; set; }
        double FitnessValue { get; set; }
        Gene<double> SocialValue { get; set; }
        Gene<double> Productivity { get; set; }
        ElementType ElementType { get; }
        int Age { get; set; }
        int X { get; set; }
        int Y { get; set; }
    }
}
