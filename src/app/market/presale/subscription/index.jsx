import { useLocation } from 'react-router-dom'
import { Icon } from '@iconify/react'
import placeholderImg from '../../../../assets/bg-svg/empty.svg'
import ICOAssetsIcon from '../../../../assets/icon-svg/ICOAssets.svg'
import ICORWATIcon from '../../../../assets/icon-svg/ICORWAT.svg'
import propertyIcon from '../../../../assets/icon-svg/b-home.svg'
import userCardIcon from '../../../../assets/icon-svg/userCard.svg'
import DashedRow from '../../components/DashedRow'
import { SubscriptionForm } from './SubscriptionForm'

export default function ShareSubscription() {
  const { state } = useLocation()
  const item = state?.item ?? {}

  const serialNo = item.projectId
    ? `US${String(item.projectId).padStart(11, '0')}`
    : 'US00238840136'
  const tokenSymbol = item.symbol ?? 'RWAT-PRO-O1'
  const title = item.projectTitle || item.baseAsset || 'Opensea House'
  const address =
    item.address ??
    'Unit 307, 8956 Arbutus Ridge Southwest Kerrisdale Neighbourhood, Vancouver British Columbia, V6P 4Z9, Canada'

  const daysRemaining = item.endTimestamp
    ? Math.max(0, Math.ceil((item.endTimestamp - Date.now()) / 86400000))
    : 55

  const walletShort = item.projectToken
    ? item.projectToken.slice(0, 6) + '...' + item.projectToken.slice(-4)
    : '0x23...2390'

  return (
    <div className="pb-4">
      <h1 className="text-2xl font-semibold text-[#142B40] text-center pb-7 pt-6">
        Share Subscription
      </h1>

      {/* 顶部信息栏 */}
      <div
        className="flex items-center justify-between px-6 py-3 mb-4"
        style={{ background: 'linear-gradient( 90deg, rgba(165,201,222,0.3) 0%, rgba(219,234,254,0.3) 100%)' }}
      >
        <div className="flex items-center gap-2">
          <img src={propertyIcon} alt="Property" className="w-7 h-7" />
          <span className="text-[14px] font-semibold text-[#142B40]">{serialNo}</span>
          <button
            className="text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none p-0"
            onClick={() => navigator.clipboard.writeText(serialNo)}
          >
            <Icon icon="bx:copy" width={13} height={13} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <img src={userCardIcon} alt="userCard" className="w-6 h-6" />
          <span className="text-[15px] font-semibold text-[#142B40]">{walletShort}</span>
          <span
            className="inline-flex items-center px-2 h-[20px] rounded text-[10px] font-semibold"
            style={{ background: '#EDF5FF', border: '1px solid #C8DEFA', color: '#0D6EC0' }}
          >
            KYC
          </span>
          <button
            className="text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none p-0"
            onClick={() => item.projectToken && navigator.clipboard.writeText(item.projectToken)}
          >
            <Icon icon="bx:copy" width={18} height={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 左侧 - 房产信息 */}
        <div className="flex-1 min-w-0">
          {/* 房产图片 */}
          <div className="w-full h-[560px] mb-6 p-3 rounded-md shadow-[0px_0_3px_0px_rgba(0,0,0,0.25)]">
            <div
              className="w-full h-full rounded-sm"
              style={{
                backgroundImage: `url(${placeholderImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#E8F0F8',
              }}
            />
          </div>

          <div className="pl-3">
            {/* 地址 */}
            <div className="flex items-start gap-2 text-[#59636E] mb-6">
              <Icon icon="material-symbols:home-pin-outline" width={22} height={22} className="mt-0.5 shrink-0" />
              <span className="text-xl">{address}</span>
            </div>
            {/* 天数 + APY + 日期 */}
            <div className="border-[#DDE7F0] h-[131px] border rounded-lg p-1 flex items-center gap-6 mb-3">
              <div className="bg-[#F4F7F9] rounded-md flex items-center justify-center gap-9 h-full p-2 w-[48%]">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-[#00032A]">{daysRemaining}</span>
                  <span className="text-xl text-[#66687F]">days</span>
                </div>
                <div className="bg-[#DBE1E5] h-16 w-px" />
                <div>
                  <div className="text-4xl font-semibold text-[#FF521D]">
                    {item.projectedAPY ?? '20%'}
                  </div>
                  <span className="text-xl text-[#66687F]">Projected APY</span>
                </div>
              </div>
              <div>
                <div className="flex items-center text-[#59636E] gap-1 mb-3">
                  <Icon icon="material-symbols-light:event-available-sharp" width={24} height={24} />
                  <span className="text-xl w-28">Start date:</span>
                  <span className="text-[#555C70] text-xl">{item.startDate ?? '2025-12-30 12:56:31'}</span>
                </div>
                <div className="flex items-center text-[#59636E] gap-1">
                  <Icon icon="material-symbols-light:event-busy-sharp" width={24} height={24} />
                  <span className="text-xl w-28">End date:</span>
                  <span className="text-[#555C70] text-xl">{item.endDate ?? '2025-12-30 12:56:31'}</span>
                </div>
              </div>
            </div>

            {/* 数据表格 */}
            <DashedRow label="Presale supply (RWAT)" value={item.presaleSupply ? Number(item.presaleSupply).toLocaleString() : '1,000,000'} subValue="≈$35.1" />
            <DashedRow label="Issue price（USD/RWAT）" value={item.targetFundraising ?? '$200,000'} />
            <DashedRow label="Use of Proceeds" value={item.useOfProceeds ?? 'Upgrade Infrastructure'} last />
          </div>
        </div>

        {/* 右侧 - 认购表单 */}
        <SubscriptionForm
          assetName={title}
          shortToken={walletShort}
          tradingPair={tokenSymbol}
          projectToken={item.projectToken ?? ''}
          issuePrice={item.issuePrice ?? 0.003}
        />
      </div>
    </div>
  )
}
