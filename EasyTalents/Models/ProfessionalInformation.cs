using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EasyTalents.Models
{
    public class ProfessionalInformation
    {
        #region Entity properties
        [Key]
        public int ProfessionalInformationId { get; set; }
        [Required]
        [MaxLength(30)]
        public string Description { get; set; }
        [Required]
        public bool Required { get; set; }
        #endregion

        #region Navigation properties
        public virtual ICollection<UserProfessionalInformation> UserProfessionalInformation { get; set; }
        #endregion
    }

    public class UserProfessionalInformation
    {
        #region Entity properties
        public int UserProfileId { get; set; }
        public int ProfessionalInformationId { get; set; }
        [Required]
        [MaxLength(50)]
        public string Value { get; set; }
        #endregion

        #region Navigation properties
        public virtual UserProfile UserProfile { get; set; }
        public virtual ProfessionalInformation ProfessionalInformation { get; set; }
        #endregion
    }
}
