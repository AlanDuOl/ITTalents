using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EasyTalents.Models
{
    public class Technology
    {
        #region Entity properties
        [Key]
        public int TechnologyId { get; set; }
        [Required]
        [MaxLength(20)]
        public string Description { get; set; }
        [Required]
        public bool Required { get; set; }
        #endregion

        #region Navigation properties
        public virtual ICollection<UserTechnologies> UserTechnologies { get; set; }
        #endregion
    }

    public class UserTechnologies
    {
        #region Entity properties
        public int UserProfileId { get; set; }
        public int TechnologyId { get; set; }
        [Required]
        [Range(0, 5)]
        public byte Score { get; set; }
        #endregion

        #region Navigation properties
        public virtual UserProfile UserProfile { get; set; }
        public virtual Technology Technology { get; set; }
        #endregion
    }
}
