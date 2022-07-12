import * as React from 'react'
export type teamMemberData = {
  id: number
  name: string
  role: string
  portfolio: string
  img: string
  aboutText: string
  uniqueColor: string
}[]
const teamData: teamMemberData = [
  {
    id: 1,
    name: 'Rakib',
    role: 'web developer',
    portfolio: 'https://rakib-seven.vercel.app/',
    img: './images/team/rakib.webp',
    aboutText:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur ullam veritatis illum itaque hic mollitia repellendus id quo provident odit?',
    uniqueColor: '#ff3230',
  },
  {
    id: 2,
    name: 'Tanvir Hossain',
    role: 'web developer',
    portfolio: 'https://prothfolioweb.web.app/',
    img: './images/team/tanvir.webp',
    aboutText:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur ullam veritatis illum itaque hic mollitia repellendus id quo provident odit?',
    uniqueColor: '#ff3230',
  },
  {
    id: 3,
    name: 'Abu Jakariya',
    role: 'web developer',
    portfolio: 'https://abujakaria-cse.web.app/',
    img: './images/team/abuJakariya.webp',
    aboutText:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur ullam veritatis illum itaque hic mollitia repellendus id quo provident odit?',
    uniqueColor: '#ff3230',
  },
  {
    id: 4,
    name: 'UK Proloy',
    role: 'web developer',
    portfolio: '',
    img: './images/team/proloy.webp',
    aboutText:
      ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur ullam veritatis illum itaque hic mollitia repellendus id quo provident odit?',
    uniqueColor: '#ff3230',
  },
]
const index = () => {
  const [selectedMember, setSelectedMember] = React.useState(teamData[0])

  return (
    <div className='max-w-5xl m-auto p-5'>
      <div className='flex justify-between items-center'>
        {teamData.map((teamDB, index) => (
          <div key={teamDB?.id}>
            <div
              className='shadow-lg p-5 flex justify-center items-center'
              onClick={() => setSelectedMember(teamData[index])}
            >
              <img src={teamDB.img} className='w-20 rounded-full mr-8' alt={teamDB.name} />
              <div>
                <h2 className='tracking-wide uppercase font-bold text-gray-700'>{teamDB.name}</h2>
                <h6>{teamDB.role}</h6>
              </div>
            </div>
          </div>
        ))}
        <div>
          <img src={selectedMember.img} alt={selectedMember.name} />
        </div>
      </div>
    </div>
  )
}

export default index
