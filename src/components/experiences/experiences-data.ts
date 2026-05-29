export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  destination: string;
  photo: string;
  rating: number;
  review: string;
  date: string;
}

export const reviews: Review[] = [
  {
    id: "kyoto-review",
    userName: "小鹿",
    userAvatar: "https://ui-avatars.com/api/?name=小鹿&background=6366f1&color=fff&size=80",
    destination: "京都 · 日本",
    photo:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    rating: 5,
    review:
      "连岚山的隐藏茶室都推荐了，完全不像机器生成的行程，像一位熟悉京都的朋友在带我逛。",
    date: "2026年4月",
  },
  {
    id: "bali-review",
    userName: "阿杰",
    userAvatar: "https://ui-avatars.com/api/?name=阿杰&background=10b981&color=fff&size=80",
    destination: "巴厘岛 · 印度尼西亚",
    photo:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    rating: 5,
    review:
      "第一次去巴厘岛完全没做攻略，AI安排的冲浪课和地道餐厅体验感拉满！性价比超高。",
    date: "2026年3月",
  },
  {
    id: "paris-review",
    userName: "Sarah",
    userAvatar: "https://ui-avatars.com/api/?name=Sarah&background=ec4899&color=fff&size=80",
    destination: "巴黎 · 法国",
    photo:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    rating: 4,
    review:
      "第三天安排的塞纳河畔野餐和圣图安跳蚤市场是亮点，非常local的体验！下次还要用。",
    date: "2026年2月",
  },
  {
    id: "tokyo-review",
    userName: "小明",
    userAvatar: "https://ui-avatars.com/api/?name=小明&background=f59e0b&color=fff&size=80",
    destination: "东京 · 日本",
    photo:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    rating: 5,
    review:
      "筑地市场的金枪鱼店排雷指南太实用了！每一餐都好吃到哭，完全没有踩雷。",
    date: "2026年1月",
  },
  {
    id: "swiss-review",
    userName: "Anna",
    userAvatar: "https://ui-avatars.com/api/?name=Anna&background=8b5cf6&color=fff&size=80",
    destination: "因特拉肯 · 瑞士",
    photo:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
    rating: 5,
    review:
      "少女峰和First山的时间安排恰到好处，连天气窗口都考虑到了，太让人省心了。",
    date: "2025年12月",
  },
  {
    id: "santorini-review",
    userName: "小丸子",
    userAvatar: "https://ui-avatars.com/api/?name=小丸子&background=ef4444&color=fff&size=80",
    destination: "圣托里尼 · 希腊",
    photo:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    rating: 4,
    review:
      "伊亚小镇的日落观景点推荐得很准，还帮我们避开了人流高峰时段，体验很棒。",
    date: "2025年11月",
  },
  {
    id: "shibuya-review",
    userName: "小野",
    userAvatar: "https://ui-avatars.com/api/?name=小野&background=06b6d4&color=fff&size=80",
    destination: "东京 · 日本",
    photo:
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80",
    rating: 5,
    review:
      "秋叶原的隐藏扭蛋店和深夜食堂太对味了！比任何旅游攻略都详细一百倍。",
    date: "2025年10月",
  },
];
