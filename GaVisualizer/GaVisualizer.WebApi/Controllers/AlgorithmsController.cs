using System.Threading.Tasks;
using GaVisualizer.BusinessLogic.Processing;
using GaVisualizer.Domain.Board;
using Microsoft.AspNetCore.Mvc;

namespace GaVisualizer.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlgorithmsController : ControllerBase
    {
        private readonly IGeneticAlgorithmProcessor geneticAlgorithmProcessor;

        public AlgorithmsController(IGeneticAlgorithmProcessor geneticAlgorithmProcessor)
        {
            this.geneticAlgorithmProcessor = geneticAlgorithmProcessor;
        }

        [HttpPost]
        public async Task<IActionResult> PostNewAlgorithm([FromBody]BoardSettings settings = null)
        {
            var id = await geneticAlgorithmProcessor.AddNewAlgorithmAsync(settings ?? new BoardSettings());
            return Ok(new { AlgorithmId = id });
        }

        [HttpGet("{id}/state")]
        public async Task<IActionResult> GetCurrentStateAsync(string id)
        {
            var currentState = await geneticAlgorithmProcessor.GetCurrentStateAsync(id);

            if (currentState == null)
            {
                return NotFound();
            }

            return Ok(currentState);
        }
    }
}