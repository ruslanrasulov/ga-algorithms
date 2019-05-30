using System;
using System.Collections.Generic;
using GaVisualizer.Domain.Population;

namespace GaVisualizer.Domain.Algorithm
{
    public class MetaInformation
    {
        public IEnumerable<IPopulationElement> NewElements { get; set; }
        public IEnumerable<Gene<double>> OldGenes { get; set; }
        public IEnumerable<(int x, int y, IPopulationElement)> SelectedElements { get; set; }
    }
}
