using System.Threading.Tasks;
using GaVisualizer.BusinessLogic.Processing;
using GaVisualizer.Domain.Board;
using GaVisualizer.WebApi.Models;
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
        public async Task<IActionResult> AddNewAlgorithmAsync([FromBody]BoardSettings settings = null)
        {
            var id = await geneticAlgorithmProcessor.AddNewAlgorithmAsync(settings ?? new BoardSettings());

            return Created($"api/algorithms/{id}", new { AlgorithmId = id });
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateAlgorithmAsync(string id, [FromBody]AlgorithmUpdateModel updateModel)
        {
            if (updateModel.IsStopped)
            {
                await geneticAlgorithmProcessor.StopAsync(id);
            }

            return Ok();
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
        
        [HttpGet]
        public async Task<IActionResult> GetAlgorithmsAsync()
        {
            var algorithms = await geneticAlgorithmProcessor.GetAlgorithmsAsync();

            return Ok(algorithms);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveAsync(string id)
        {
            await geneticAlgorithmProcessor.RemoveAsync(id);

            return Ok();
        }
    }
}