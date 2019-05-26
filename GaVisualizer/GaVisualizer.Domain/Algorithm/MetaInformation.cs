using System;
using System.Collections.Generic;
using GaVisualizer.Domain.Population;

namespace GaVisualizer.Domain.Algorithm
{
    public class MetaInformation
    {
        public IEnumerable<IPopulationElement> NewElements { get; set; }
        public IEnumerable<(Guid elementId, Gene<double>)> MutatedGenes { get; set; }
    }
}
