using System.Threading.Tasks;
using GaVisualizer.BusinessLogic.Processing;
using GaVisualizer.Domain.Board;
using Microsoft.AspNetCore.Mvc;

namespace GaVisualizer.WebApi.Controllers
{
    [ApiController]
    public class AlgorithmController : ControllerBase
    {
        private readonly IGeneticAlgorithmProcessor geneticAlgorithmProcessor;

        public AlgorithmController(IGeneticAlgorithmProcessor geneticAlgorithmProcessor)
        {
            this.geneticAlgorithmProcessor = geneticAlgorithmProcessor;
        }

        [HttpPost]
        public async Task<IActionResult> PostNewAlgorithm()
        {
            var id = await geneticAlgorithmProcessor.AddNewAlgorithmAsync(new BoardSettings());
            return Ok(id);
        }

        [HttpGet("{id}/state")]
        public async Task<IActionResult> GetCurrentStateAsync(string id)
        {
            var currentState = await geneticAlgorithmProcessor.GetCurrentStateAsync(id);
            return Ok(currentState);
        }
    }
}