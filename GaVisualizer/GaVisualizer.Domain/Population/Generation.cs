using System;

namespace GaVisualizer.Domain.Population
{
    public class Generation : ICloneable
    {
        public IPopulationElement[,] Cells { get; set; }

        public object Clone()
        {
            var cells = Cells.Clone() as IPopulationElement[,];

            return new Generation
            {
                Cells = cells
            };
        }
    }
}
