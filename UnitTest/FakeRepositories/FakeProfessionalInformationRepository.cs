using EasyTalents.Models;
using EasyTalents.Repositories;
using System;
using UnitTest.FakeServices;

namespace UnitTest.FakeRepositories
{
    public class FakeProfessionalInformationRepository : IProfessionalInformationRepository
    {
        public ProfessionalInformation[] ProfessionalInformation { get; set; }

        public FakeProfessionalInformationRepository()
        {
            ProfessionalInformation = FakeData.GetProfessionalInformation();
        }

        public ProfessionalInformation[] Get()
        {
            return ProfessionalInformation;
        }
    }

    public class FakeProfessionalInformationRepositoryError : IProfessionalInformationRepository
    {
        public ProfessionalInformation[] Get()
        {
            throw new NotImplementedException();
        }
    }
}
