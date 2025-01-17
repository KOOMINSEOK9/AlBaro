package hello.core.discount;

import hello.core.member.Grade;
import hello.core.member.Member;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

class RateDiscountPolicyTest {
    RateDiscountPolicy discountPolicy = new RateDiscountPolicy();

    @Test
    @DisplayName("VIP할인은 10% 할인이 적용되어야 한다.")
    void vip_o(){
        //given
        Member member = new Member(1L, "memberVIP", Grade.VIP);
        //when
        int discount = discountPolicy.discount(member, 10000);
        //then
        assertThat(discount).isEqualTo(1000);
        //할인된 금액이 1000원이기 때문에 1000이 나와야 함
        //static import 하면 import 하나 올라가고 스태틱하게 됨
    }

//    @Test
//    @DisplayName("VIP가 아니면 할인이 적용되지 않아야 한다.")
//    void vip_x(){
//        //given
//        Member member = new Member(2L, "memberBASIC", Grade.BASIC);
//        //when
//        int discount = discountPolicy.discount(member, 10000);
//        //then
//        assertThat(discount).isEqualTo(1000);
//        //VIP가 아니라서 0원이 나와야 함 -> 오류메세지 보면 확인 가능
//    }
    
    
}