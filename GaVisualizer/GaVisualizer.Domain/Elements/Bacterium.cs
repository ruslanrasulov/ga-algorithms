using System;
using GaVisualizer.Domain.Board;

namespace GaVisualizer.Domain.Elements
{
    public class Bacterium : IBoardElement
    {
        public int Height { get; set; }
        public int Width { get; set; }

        public double VirusImmunity { get; set; }
        public double ReproductivityRate { get; set; }
        public double FitnessValue { get; set; }
        public double SocialValue { get; set; }
        public ElementType ElementType => ElementType.Bacteria;

        public TimeSpan LifeTime { get; set; }
    }
}
