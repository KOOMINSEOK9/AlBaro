package hello.core.order;

import hello.core.discount.DiscountPolicy;
import hello.core.discount.RateDiscountPolicy;
import hello.core.member.Member;
import hello.core.discount.FixDisountPolicy;
import hello.core.member.MemberRepository;
import hello.core.member.MemoryMemberRepository;

public class OrderServiceImpl implements OrderService{

//    private final MemberRepository memberRepository = new MemoryMemberRepository();
//    private final DiscountPolicy discountPolicy = new FixDisountPolicy();
//    private final DiscountPolicy discountPolicy = new RateDiscountPolicy();
    ///  할인에 대한 것과 주문에 대한 것이 따로따로 만들어졌기 때문에 서로 영향 X
    /// -> 단일 체계 원칙을 잘 지킴, 할인에 대한 정책이 불확실하고 바뀌더라도 어차피 주문과는 관련이 없음

    /*
    * 할인정책을 변경하려면 (할인정책의) 클라이언트인 OrderServiceImpl 코드를 고쳐야 함
    * 왜? discountPolicy의 구현체를 바꿔줘야 하기 때문에!
    * */

    //변경 후
    private final MemberRepository memberRepository;
    private final DiscountPolicy discountPolicy; // 추상화인 인터페이스에만 의존함

    public OrderServiceImpl(MemberRepository memberRepository, DiscountPolicy discountPolicy) {
        this.memberRepository = memberRepository;
        this.discountPolicy = discountPolicy;
    }

    @Override
    public Order createOrder(Long memberId, String itemName, int itemPrice) {

        Member member = memberRepository.findById(memberId);
        int discountPrice = discountPolicy.discount(member, itemPrice);

        return new Order(memberId, itemName, itemPrice, discountPrice);
    }
}
