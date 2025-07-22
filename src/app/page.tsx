'use client'

import React from 'react'
import { Col, Image, Progress, Row, Timeline } from 'antd'
import { Icon } from '@iconify/react'
import Typeit from 'typeit-react'

import { SkillPackList, LifeTrajectory } from '@/src/constants'

/**
 * 获取问候语
 */
const getHelloStr = () => {
  const nowHour = new Date().getHours()
  if (nowHour >= 3 && nowHour < 8) return '早上好'
  if (nowHour >= 8 && nowHour < 12) return '上午好'
  if (nowHour >= 12 && nowHour < 14) return '中午好'
  if (nowHour >= 14 && nowHour < 18) return '下午好'
  return '晚上好'
}

const typeitOptions = {
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

interface ContainerBoxProps {
  icon: string
  title: string
  children: React.ReactNode
}

const ContainerBox: React.FC<ContainerBoxProps> = ({ icon, title, children }) => (
  <div className="p-20px bg-color b-rd-8px">
    <div className="flex-y-center gap-10px mb-10px font-bold text-18px">
      <Icon icon={icon} className="text-20px" />
      {title}
    </div>
    <div className="pt-20px">{children}</div>
  </div>
)

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-20px">
      <div className="p-20px bg-color b-rd-8px text-center h-150px">
        <Typeit
          options={typeitOptions}
          className="text-18px font-italic"
        />
      </div>
      <ContainerBox icon="ri:history-line" title="人生轨迹">
        <div className="flex-center">
          <Timeline
            mode="alternate"
            items={LifeTrajectory.map(({ dot, color, date, content }) => ({
              dot,
              color,
              children: (
                <div className="text-color">
                  <p className="font-bold">{date}</p>
                  <p>{content}</p>
                </div>
              )
            }))}
            className="w-full"
          />
        </div>
      </ContainerBox>
      <ContainerBox icon="material-symbols:tools-wrench-outline-sharp" title="个人技能">
        <Row gutter={[20, 20]}>
          {SkillPackList.map(({ skillName, icon, proficiency }) => (
            <Col key={skillName} span={6}>
              <div className="flex-y-center gap-6px">
                <Image
                  src={icon}
                  width={40}
                  height={40}
                  alt={skillName}
                  preview={false}
                />
                <div className="flex-grow-1">
                  <p className="mb-4px">{skillName}</p>
                  <Progress
                    percent={proficiency}
                    showInfo={false}
                    size="small"
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068'
                    }}
                  />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </ContainerBox>
    </div>
  )
}

export default Home
