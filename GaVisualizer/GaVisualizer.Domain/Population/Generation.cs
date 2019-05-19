using System;

namespace GaVisualizer.Domain.Population
{
    public class Generation : ICloneable
    {
        public IPopulationElement[,] Cells { get; set; }

        public object Clone()
        {
            var width = Cells.GetLength(0);
            var height = Cells.GetLength(1);
            var cells = new IPopulationElement[width, height];
            
            for (int i = 0; i < width; i++)
            {
                for (int j = 0; j < height; j++)
                {
                    cells[i, j] = Cells[i, j].Clone() as IPopulationElement;
                }
            }

            return new Generation
            {
                Cells = cells
            };
        }
    }
}
