using System.ComponentModel.DataAnnotations;

namespace EasyTalents.ViewModels
{
    public class FrontEndError
    {
        [Required]
        public string Type { get; set; }
        [Required]
        public string Path { get; set; }
        public string Message { get; set; }
    }
}
