using EasyTalents.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EasyTalents.ViewModels
{
    public class UserForm
    {
        #region Required properties
        public int? ProfileId { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Phone { get; set; }
        [Required]
        [RegularExpression("^[0-9]+$")]
        public int HourlySalary { get; set; }
        [Required]
        public LocationInput Location { get; set; }
        [Required]
        public TechnologyInput[] Technologies { get; set; }
        [Required]
        public ProfessionalInformationInput[] ProfessionalInformation { get; set; }
        #endregion

        #region None required properties
        public int[] WorkingHoursIds { get; set; }
        public int[] WorkingShiftIds { get; set; }
        #endregion
    }

    public class TechnologyInput
    {
        [Required]
        public int Id { get; set; }
        [Required]
        [RegularExpression("[0-5]")]
        public byte Score { get; set; }
    }

    public class LocationInput
    {
        [Required]
        public string City { get; set; }
        [Required]
        public string State { get; set; }
    }

    public class ProfessionalInformationInput
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Value { get; set; }
    }

    public class RequestResult
    {
        public RequestResult(bool created, bool deleted, bool update)
        {
            Updated = update;
            Deleted = deleted;
            Created = created;
        }
        public bool Updated { get; set; }
        public bool Deleted { get; set; }
        public bool Created { get; set; }
    }

    public class ProfileList
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }

    public class UserData
    {
        public UserProfile UserProfile { get; set; }
        public List<UserProfessionalInformation> UserProfessionalInformation { get; set; }
        public List<UserTechnologies> UserTechnologies { get; set; }
        public List<UserWorkingShift> UserWorkingShifts { get; set; }
        public List<UserDailyWorkingHours> UserDailyWorkingHours { get; set; }
    }
}
