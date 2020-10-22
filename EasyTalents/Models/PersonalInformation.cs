using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EasyTalents.Models
{
    public class ApplicationUser : IdentityUser
    {
    }

    public class UserProfile
    {
        #region Entity properties
        [Key]
        public int UserProfileId { get; set; }
        [Required]
        public string AppUserId { get; set; }
        [Required]
        [MaxLength(30)]
        public string Name { get; set; }
        [Required]
        [MaxLength(50)]
        public string Email { get; set; }
        [Required]
        [MaxLength(20)]
        public string Phone { get; set; }
        [Required]
        public int HourlySalary { get; set; }
        [Required]
        public int LocationId { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        [Required]
        public DateTime UpdatedAt { get; set; }
        #endregion

        #region Navigation properties
        public virtual ApplicationUser AppUser { get; set; }
        public virtual Location Location { get; set; }
        public virtual ICollection<UserTechnologies> UserTechnologies { get; set; }
        public virtual ICollection<UserProfessionalInformation> UserProfessionalInformation { get; set; }
        public virtual ICollection<UserDailyWorkingHours> UserDailyWorkingHours { get; set; }
        public virtual ICollection<UserWorkingShift> UserWorkingShifts { get; set; }
        #endregion
    }

    public class Location
    {
        #region Entity properties
        [Key]
        public int LocationId { get; set; }
        [Required]
        [MaxLength(30)]
        public string City { get; set; }
        [Required]
        [MaxLength(30)]
        public string State { get; set; }
        #endregion

        #region Navigation properties
        public virtual ICollection<UserProfile> UserProfiles { get; set; }
        #endregion
    }
}
