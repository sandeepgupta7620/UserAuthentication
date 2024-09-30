using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserAuthenticationSandeepGupta.Models
{
    public class LoginCheck
    {
        [Key]
        public int LoginId  { get; set; }
        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }
        [Required]
        public string IsValid { get; set; } = "";
        public DateTime CreatedAt { get; set; }

        public string LoginIPAddress { get; set; } = "";


    }
}
