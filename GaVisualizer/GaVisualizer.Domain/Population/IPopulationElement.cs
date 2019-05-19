using System;

namespace GaVisualizer.Domain.Population
{
    public interface IPopulationElement : ICloneable
    {
        double FitnessValue { get; set; }
        Gene<double> SocialValue { get; set; }
        Gene<double> Productivity { get; set; }
        ElementType ElementType { get; }
        int Age { get; set; }
    }
}
