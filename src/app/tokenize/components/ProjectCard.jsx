import resubmitIcon from '../../../assets/icon-svg/resubmit.svg'
import { Icon } from '@iconify/react'
import CardLayout from './CardLayout'

const DISABLED_BTN = 'px-3 py-1.5 bg-white text-gray-300 text-sm font-medium rounded-sm border border-gray-200 cursor-not-allowed opacity-60'
const ACTIVE_BTN = 'px-3 py-1.5 bg-white text-[#22537D] text-sm font-medium rounded-sm border border-[#22537D] hover:bg-blue-50 transition-colors'
const PRIMARY_BTN = 'px-3 py-1.5 bg-[#22537D] text-white text-sm font-medium rounded hover:bg-[#1a4160] transition-colors'

function getButtons(status) {
  if (status === 'tokenized') {
    return (
      <>
        <button className={ACTIVE_BTN}>ICO Fundraising</button>
        <button className={ACTIVE_BTN}>Distribute Returns</button>
        <button className={ACTIVE_BTN}>Repurchase</button>
        <button className={ACTIVE_BTN}>Withdraw</button>
        <button className={PRIMARY_BTN}>Details</button>
      </>
    )
  }

  if (status === 'rejected') {
    return (
      <>
        <button disabled className={DISABLED_BTN}>ICO Fundraising</button>
        <button disabled className={DISABLED_BTN}>Distribute Returns</button>
        <button disabled className={DISABLED_BTN}>Repurchase</button>
        <button disabled className={DISABLED_BTN}>Withdraw</button>
        <button className="w-8 h-8 bg-[#7D2224] text-white rounded flex items-center justify-center hover:bg-[#651B1D] transition-colors">
          <Icon icon="ri:delete-bin-5-line" className="w-5 h-5" />
        </button>
        <button className="px-3 py-1.5 bg-[#22537D] text-white text-sm font-medium rounded hover:bg-[#1a4160] transition-colors flex items-center gap-1.5">
          <img src={resubmitIcon} alt="Resubmit" className="w-[18px] h-[18px]" />
          Resubmit
        </button>
        <button className={PRIMARY_BTN}>Details</button>
      </>
    )
  }

  // reviewing / draft / other
  return (
    <>
      <button disabled className={DISABLED_BTN}>ICO Fundraising</button>
      <button disabled className={DISABLED_BTN}>Distribute Returns</button>
      <button disabled className={DISABLED_BTN}>Repurchase</button>
      <button disabled className={DISABLED_BTN}>Withdraw</button>
      <button className={PRIMARY_BTN}>Details</button>
    </>
  )
}

function ProjectCard({ project }) {
  const buttons = getButtons(project.status)

  return (
    <CardLayout
      projectNo={project.projectNo}
      buttons={buttons}
      onExpand={() => {
        // TODO: fetch project details
      }}
    />
  )
}

export default ProjectCard
