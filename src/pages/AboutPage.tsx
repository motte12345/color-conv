import { PageHead } from '../components/PageHead'

export default function AboutPage() {
  return (
    <>
      <PageHead
        title="概要・免責事項"
        description="カラー変換ツールの概要、免責事項、お問い合わせ先について。"
        path="/about"
      />
      <h1 className="page-title">概要・免責事項</h1>

      <div className="card">
        <h2>このツールについて</h2>
        <p>
          カラー変換ツールは、色コードの相互変換と配色生成をブラウザ上で完結させる無料ツールです。
          すべての計算はクライアントサイドで行われ、データが外部に送信されることはありません。
        </p>
      </div>

      <div className="card">
        <h2>免責事項</h2>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
          <li>CMYKの変換はICCプロファイルを考慮しない概算であり、実際の印刷色とは異なります。</li>
          <li>モニターの表示特性により、実際に見える色は環境によって異なります。</li>
          <li>本ツールの利用により生じた損害について、運営者は責任を負いません。</li>
        </ul>
      </div>

      <div className="card">
        <h2>お問い合わせ</h2>
        <p>
          ご質問・ご要望は下記までお願いいたします。
        </p>
        <p style={{ marginTop: 8 }}>
          メール: tm.qp.sites@gmail.com
        </p>
      </div>
    </>
  )
}
