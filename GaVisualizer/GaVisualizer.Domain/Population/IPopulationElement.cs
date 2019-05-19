using System;

namespace GaVisualizer.Domain.Population
{
    public interface IPopulationElement : ICloneable
    {
        double FitnessValue { get; set; }
        double SocialValue { get; set; }
        double Productivity { get; set; }
        ElementType ElementType { get; }
        int Age { get; set; }
    }
}
