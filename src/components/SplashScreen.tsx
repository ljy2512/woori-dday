import { useState } from 'react'

interface Props {
  onStart: () => void
}

const FLOATING_HEARTS = [
  { left: '11%', top: '17%', size: 20, color: 'rgba(255,255,255,0.55)', delay: '0s',   dur: '5.2s' },
  { right: '13%', top: '25%', size: 15, color: '#F4A09A',               delay: '0.8s', dur: '6.4s' },
  { left:  '17%', top: '43%', size: 13, color: '#CFC2EC',               delay: '0.3s', dur: '7.0s' },
  { right: '16%', bottom: '36%', size: 18, color: 'rgba(255,255,255,0.5)', delay: '1.1s', dur: '5.8s' },
  { left:  '13%', bottom: '43%', size: 11, color: '#F4A09A',            delay: '0.5s', dur: '6.8s' },
]

const HEART_PATH = 'M12 21s-8-5.3-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.7-8 11-8 11z'

export default function SplashScreen({ onStart }: Props) {
  const [pressed, setPressed] = useState(false)

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ background: 'linear-gradient(168deg, #9C93B8 0%, #857CA2 52%, #6E6690 100%)' }}
    >
      <style>{`
        @keyframes splashBeat {
          0%,100% { transform: scale(1) }
          13%  { transform: scale(1.13) }
          26%  { transform: scale(1) }
          40%  { transform: scale(1.09) }
          66%  { transform: scale(1) }
        }
        @keyframes splashRise {
          from { opacity: 0; transform: translateY(22px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        @keyframes splashBob {
          0%,100% { transform: translateY(0) }
          50%     { transform: translateY(-13px) }
        }
        @keyframes splashOrb {
          0%,100% { transform: translate(0,0) scale(1) }
          50%     { transform: translate(10px,-14px) scale(1.1) }
        }
        @keyframes splashShine {
          0%        { transform: translateX(-130%) }
          55%,100%  { transform: translateX(230%) }
        }
        .splash-rise-1 { animation: splashRise .7s ease-out both .15s }
        .splash-rise-2 { animation: splashRise .7s ease-out both .28s }
        .splash-rise-3 { animation: splashRise .7s ease-out both .4s }
        .splash-rise-4 { animation: splashRise .7s ease-out both .55s }
      `}</style>

      {/* 소프트 배경 orbs */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          top: '-40px', right: '-50px', width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(238,137,140,0.42), rgba(238,137,140,0) 70%)',
          animation: 'splashOrb 9s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          bottom: '120px', left: '-60px', width: '220px', height: '220px',
          background: 'radial-gradient(circle, rgba(185,169,224,0.5), rgba(185,169,224,0) 70%)',
          animation: 'splashOrb 11s ease-in-out infinite 0.6s',
        }}
      />

      {/* 떠다니는 작은 하트들 */}
      {FLOATING_HEARTS.map((h, i) => (
        <div
          key={i}
          className="pointer-events-none absolute"
          style={{
            left: h.left, right: (h as any).right,
            top: h.top, bottom: (h as any).bottom,
            opacity: (h === FLOATING_HEARTS[0] || h === FLOATING_HEARTS[3]) ? 0.6 :
                     (h === FLOATING_HEARTS[1]) ? 0.7 :
                     (h === FLOATING_HEARTS[2]) ? 0.55 : 0.6,
            animation: `splashBob ${h.dur} ease-in-out infinite ${h.delay}`,
          }}
        >
          <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill={h.color}>
            <path d={HEART_PATH} />
          </svg>
        </div>
      ))}

      {/* 중앙 콘텐츠 */}
      <div
        className="absolute inset-x-0 flex flex-col items-center px-8"
        style={{ top: '29%' }}
      >
        {/* 더블 하트 로고 */}
        <div
          style={{
            position: 'relative', width: 128, height: 118,
            filter: 'drop-shadow(0 16px 26px rgba(60,40,70,0.4))',
            animation: 'splashBeat 2.6s ease-in-out infinite 0.7s',
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: 14, transform: 'rotate(-11deg)' }}>
            <svg width={78} height={78} viewBox="0 0 24 24">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="#EE898C"
              />
            </svg>
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, transform: 'rotate(11deg)' }}>
            <svg width={88} height={88} viewBox="0 0 24 24">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="#CFC2EC"
                stroke="white"
                strokeWidth={1}
                strokeOpacity={0.6}
              />
            </svg>
          </div>
        </div>

        {/* 우리 */}
        <div
          className="splash-rise-1 text-white"
          style={{
            fontFamily: "'Nanum Pen Script', cursive",
            fontSize: 74,
            lineHeight: 0.9,
            marginTop: 26,
            textShadow: '0 3px 14px rgba(60,40,70,0.3)',
          }}
        >
          우리
        </div>

        {/* 슬로건 */}
        <div
          className="splash-rise-2 mt-4 font-bold text-white"
          style={{ fontSize: 16, letterSpacing: '-0.01em' }}
        >
          함께한 모든 날을 세어요
        </div>

        {/* 설명 */}
        <div
          className="splash-rise-3 mt-2 text-center leading-relaxed"
          style={{ fontSize: 12.5, color: '#DAD5E6', lineHeight: 1.5 }}
        >
          사랑하는 사람과의 디데이를 한 곳에서.<br />
          오늘이 며칠째인지, 그날까지 며칠인지.
        </div>
      </div>

      {/* 하단 CTA */}
      <div
        className="splash-rise-4 absolute inset-x-6 flex flex-col items-center gap-4"
        style={{ bottom: 48 }}
      >
        {/* 시작하기 버튼 */}
        <button
          type="button"
          onClick={onStart}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onTouchStart={() => setPressed(true)}
          onTouchEnd={() => setPressed(false)}
          className="relative w-full overflow-hidden font-extrabold text-white"
          style={{
            border: 'none',
            borderRadius: 18,
            padding: '17px 0',
            background: 'linear-gradient(135deg, #F4A09A, #EE898C)',
            boxShadow: pressed
              ? '0 6px 16px rgba(238,137,140,0.45)'
              : '0 14px 28px rgba(238,137,140,0.5)',
            fontSize: 16.5,
            transform: pressed ? 'scale(0.97)' : 'none',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            cursor: 'pointer',
            letterSpacing: '0.01em',
          }}
        >
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            시작하기{' '}
            <svg width={17} height={17} viewBox="0 0 24 24" fill="white">
              <path d={HEART_PATH} />
            </svg>
          </span>
          {/* 샤인 효과 */}
          <span
            className="pointer-events-none absolute inset-y-0 left-0"
            style={{
              width: '42%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.4), rgba(255,255,255,0))',
              animation: 'splashShine 3.6s ease-in-out infinite 1.4s',
              zIndex: 1,
            }}
          />
        </button>

        {/* 불러오기 링크 */}
        <div style={{ fontSize: 13, color: '#E2DEEC' }}>
          이미 함께하고 있어요?{' '}
          <span
            onClick={onStart}
            style={{
              color: '#fff',
              fontWeight: 700,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              cursor: 'pointer',
            }}
          >
            불러오기
          </span>
        </div>
      </div>

      {/* 홈 인디케이터 */}
      <div
        className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full"
        style={{ width: 104, height: 5, background: 'rgba(255,255,255,0.5)' }}
      />
    </div>
  )
}
