using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EasyTalents.Models
{
    public class DailyWorkingHours
    {
        #region Entity properties
        [Key]
        public int DailyWorkingHoursId { get; set; }
        [Required]
        [MaxLength(20)]
        public string Description { get; set; }
        #endregion

        #region Navigation properties
        public virtual ICollection<UserDailyWorkingHours> UserDailyWorkingHours { get; set; }
        #endregion
    }

    public class UserDailyWorkingHours
    {
        #region Entity properties
        public int UserProfileId { get; set; }
        public int DailyWorkingHoursId { get; set; }
        #endregion

        #region Navigation properties
        public virtual UserProfile UserProfile { get; set; }
        public virtual DailyWorkingHours DailyWorkingHours { get; set; }
        #endregion
    }

    public class WorkingShift
    {
        #region Entity properties
        [Key]
        public int WorkingShiftId { get; set; }
        [Required]
        [MaxLength(20)]
        public string Description { get; set; }
        #endregion

        #region Navigation properties
        public virtual ICollection<UserWorkingShift> UserWorkingShifts { get; set; }
        #endregion
    }

    public class UserWorkingShift
    {
        #region Entity properties
        public int UserProfileId { get; set; }
        public int WorkingShiftId { get; set; }
        #endregion

        #region Navigation properties
        public virtual UserProfile UserProfile { get; set; }
        public virtual WorkingShift WorkingShift { get; set; }
        #endregion
    }
}
