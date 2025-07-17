'use client'

import { Col, Image, Progress, Row, Timeline } from 'antd'
import Typeit from 'typeit-react'

import { SkillPackList } from '@/src/constants'
import { LifeTrajectory } from '@/src/constants'

const Home = () => {
  const getHelloStr = () => {
    const nowHour = new Date().getHours()
    let helloStr = ''
    if (nowHour >= 3 && nowHour < 8) {
      helloStr = '早上好'
    } else if (nowHour >= 8 && nowHour < 12) {
      helloStr = '上午好'
    } else if (nowHour >= 12 && nowHour < 14) {
      helloStr = '中午好'
    } else if (nowHour >= 14 && nowHour < 18) {
      helloStr = '下午好'
    } else {
      helloStr = '晚上好'
    }
    return helloStr
  }

  const options = {
    strings: [
      `Hello，${getHelloStr()}，我是typeofNaN，一名软件开发工程师。`,
      '欢迎来到我的个人空间。',
      '这里展示了一些我的博客文章、项目、记录生活的相册。',
      '茫茫人海，很幸运，在这里，遇见你 ❤️'
    ],
    lifeLike: true,
    speed: 120,
    loop: false
  }

  return (
    <div className="flex flex-col gap-20px">
      <div className="p-20px bg-color b-rd-8px text-center h-150px">
        <Typeit options={options} className="text-18px font-italic" />
      </div>
      <div className="p-20px bg-color b-rd-8px">
        <div className="flex-y-center gap-10px mb-10px font-bold text-18px">
          <div className="w-4px h-20px bg-primary" />
          人生轨迹
        </div>
        <div className="flex-center pt-20px">
          <Timeline
            mode="alternate"
            items={
              LifeTrajectory.map(trajectory => {
                return {
                  dot: trajectory.dot,
                  color: trajectory.color,
                  children: (
                    <div className="text-color">
                      <p className="font-bold">{trajectory.date}</p>
                      <p>{trajectory.content}</p>
                    </div>
                  )
                }
              })
            }
            className="w-full"
          />
        </div>
      </div>
      <div className="p-20px bg-color b-rd-8px">
        <div className="flex-y-center gap-10px mb-10px font-bold text-18px">
          <div className="w-4px h-20px bg-primary" />
          个人技能包
        </div>
        <Row gutter={[12, 12]}>
          {
            SkillPackList.map(skillPack => {
              return (
                <Col key={skillPack.skillName} span={6}>
                  <div className="flex-y-center gap-6px">
                    <Image src={skillPack.icon} width={40} height={40} alt={skillPack.skillName} preview={false} />
                    <div className="flex-grow-1">
                      <p>{skillPack.skillName}</p>
                      <Progress percent={skillPack.proficiency} showInfo={false} size="small" />
                    </div>
                  </div>
                </Col>
              )
            })
          }
        </Row>
      </div>
    </div>
  )
}

export default Home
