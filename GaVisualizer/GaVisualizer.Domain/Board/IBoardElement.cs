using System;

namespace GaVisualizer.Domain.Board
{
    public interface IBoardElement : ICloneable
    {
        double FitnessValue { get; set; }
        double SocialValue { get; set; }
        double Productivity { get; set; }
        ElementType ElementType { get; }
    }
}
