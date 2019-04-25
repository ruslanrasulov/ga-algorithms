using System;

namespace GaVisualizer.Domain.Board
{
    public interface IBoardElement : ICloneable
    {
        double FitnessValue { get; set; }
        double SocialValue { get; set; }
        ElementType ElementType { get; }
    }
}
