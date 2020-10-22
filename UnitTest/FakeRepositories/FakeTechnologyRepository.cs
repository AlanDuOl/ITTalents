using EasyTalents.Models;
using EasyTalents.Repositories;
using System;
using UnitTest.FakeServices;

namespace UnitTest.FakeRepositories
{
    public class FakeTechnologyRepository : ITechnologyRepository
    {
        public Technology[] Technologies { get; set; }

        public FakeTechnologyRepository()
        {
            Technologies = FakeData.GetTechnologies();
        }

        public Technology[] Get()
        {
            return Technologies;
        }
    }

    public class FakeTechnologyRepositoryError : ITechnologyRepository
    {
        public Technology[] Get()
        {
            throw new NotImplementedException();
        }
    }
}
