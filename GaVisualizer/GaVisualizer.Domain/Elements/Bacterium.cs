using System;
using GaVisualizer.Domain.Board;

namespace GaVisualizer.Domain.Elements
{
    public class Bacterium : IBoardElement
    {
        public double FitnessValue { get; set; }
        public double SocialValue { get; set; }
        public double Productivity { get; set; }
        public int? Age { get; set; }
        public ElementType ElementType => ElementType.Bacteria;

        public object Clone()
        {
            return MemberwiseClone();
        }
    }
}
