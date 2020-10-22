
export const maxPageNumber: number = 2;

export const formLabels: { [key: string]: any } = {
  header: [
    "Personal Information / Informação Pessoal",
    "Professional Information / Informação Profissional",
    "Knowledge / Conhecimentos"
  ],
  instruction: [
    ["Required *"],
    ["Required *"],
    [
      `Rate yourself from 0 to 5 for the knowledge specified below, and that's okay if you do not know many things,
          the important thing is to be honest! / Avalie-se de 0 a 5 quanto aos conhecimentos especificados abaixo, e tudo
          bem se não souber de muitas coisas, o importante é que seja sincero!`,
      "Required *"
    ],
  ],
  placeholder: "Answer / Resposta",
  page: [
    [
      {
        label: "Email Address / Endereço de Email:",
        name: "email"
      },
      {
        label: "Name / Nome:",
        name: "name",
      },
      {
        label: "Phone / Telefone (Whatsapp):",
        name: "phone",
      },
      {
        label: "City / Cidade:",
        name: "city",
      },
      {
        label: "State / Estado:",
        name: "state",
      }
    ],
    [
      {
        label: "Skype ( please create an account if you don't have yet / bom criar caso não tenha):",
        name: "skype",
        formGroup: "professionalInformation",
        required: true
      },
      {
        label: "Linkedin:",
        name: "linkedin",
        formGroup: "professionalInformation"
      },
      {
        label: "Portfolio:",
        name: "portfolio",
        formGroup: "professionalInformation"
      }
    ],
    [
      {
        label : `Do you know any other language or framework that was not listed above? Tell us and evaluate yourself from 0 to 5
                / Conhece outra linguagem ou framework que não estão listados acima? Conte-nos e avalie-se de 0 a 5:`,
        name: "otherTechnology",
        required: false
      },
      {
        label: "Link for CRUD project / Link para projeto CRUD:",
        name: "linkCrud",
        required: false
      }
    ]
  ],
  hourlySalary: {
    label: "What is your hourly salary requirements? / Qual sua pretensão salarial por hora?",
    name: "hourlySalary",
    required: true
  },
  checkbox: [
    {
      header: "What's the best time to work for you? / Pra você qual é o melhor horário para trabalhar?",
      formGroup: "workingShifts",
      options: [
        {
          label: "Morning (from 08:00 to 12:00) / Manhã (de 08:00 ás 12:00)",
          name: "morning",
          value: "Morning"
        },
        {
          label: "Afternoon (from 1:00 p.m. to 6:00 p.m.) / Tarde (de 13:00 ás 18:00)",
          name: "afternoon",
          value: "Afternoon"
        },
        {
          label: "Night (7:00 p.m. to 10:00 p.m.) /Noite (de 19:00 as 22:00)",
          name: "night",
          value: "Night"
        },
        {
          label: "Dawn (from 10 p.m. onwards) / Madrugada (de 22:00 em diante)",
          name: "dawn",
          value: "Dawn"
        },
        {
          label: "Business (from 08:00 a.m. to 06:00 p.m.) / Comercial (de 08:00 as 18:00)",
          name: "business",
          value: "Business"
        }
      ]
    },
    {
      header: "What is your willingness to work today? / Qual é sua disponibilidade para trabalhar hoje?",
      formGroup: "dailyWorkingHours",
      options: [
        {
          label: "Up to 4 hours per day / Até 4 horas por dia",
          name: "daily1",
          value: "Up to 4"
        },
        {
          label: "4 to 6 hours per day / De 4 á 6 horas por dia",
          name: "daily2",
          value: "4 to 6"
        },
        {
          label: "6 to 8 hours per day /De 6 á 8 horas por dia",
          name: "daily3",
          value: "6 to 8"
        },
        {
          label: "Up to 8 hours a day (are you sure?) / Acima de 8 horas por dia (tem certeza?)",
          name: "daily4",
          value: "Up to 8"
        },
        {
          label: "Only weekends / Apenas finais de semana",
          name: "daily5",
          value: "Weekends"
        }
      ]
    }
  ],
  technologies: {
    options: ['0', '1', '2', '3', '4', '5'],
    startLabel: "I don't know / Não conheço",
    endLabel: "Senior"
  }
}
