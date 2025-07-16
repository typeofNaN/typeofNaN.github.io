'use client'

import { Image } from 'antd'
import Typeit from 'typeit-react'
import { SkillPackList } from '../constants'

const Home = () => {
  const options = {
    strings: [
      '“Hello，我是typeofNaN，一名前端开发工程师。欢迎来到我的个人空间。',
      '这里展示了一些我的博客文章、做过的项目、记录生活的相册。',
      '茫茫人海，很幸运，在这里，遇见你 ❤️”'
    ],
    lifeLike: true,
    speed: 120,
    loop: false
  }

  return (
    <div className="flex flex-col gap-20px">
      <div className="p-20px bg-color b-rd-8px text-center h-120px">
        <Typeit options={options} className="text-18px font-italic" />
      </div>
      <div className="p-20px bg-color b-rd-8px">
        <div className="flex-y-center gap-10px mb-10px font-bold text-18px">
          <div className="w-4px h-20px bg-primary" />
          个人技能包
        </div>
        <div className="flex-y-center flex-wrap gap-10px">
          {
            SkillPackList.map(skillPack => {
              return (
                <Image key={skillPack.skillName} src={skillPack.icon} width={40} height={40} alt={skillPack.skillName} preview={false} />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Home
