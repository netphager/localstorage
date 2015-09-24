<?php

$postdata = file_get_contents("php://input");

if(!empty($postdata)) {
	if(mb_strpos($postdata, 'Init')!==false) {
		echo "<?xml version='1.0' encoding='UTF-8'?>";
?>

<!DOCTYPE GameResponse SYSTEM "http://www.orbisuk.com/igf/dtd/GameResponse.dtd">
<GameResponse>
	<Header>
		<GameId id='9166' ver='1' channel='I' />
		<Customer>
			<Account balance="1000.00" held_funds="0.00" ccy_code="GBP" adjusted_free_balance="No" ccy_decimal_separator="." ccy_thousand_separator="," />
		</Customer>
	</Header>
	<Init min_anim_time='1000' max_anim_time='30000' min_stake='0.01' max_stake='3000.00' dflt_stake='2.00' max_winnings='250000.00' stake_incr='0.50|2.00|5.00|20.00|50.00|100.00|200.00' new='Yes' stake='0.00' stake_per_line='0.00' win='0.00' id='0'>
		<BetPayout total="121">
			<BetSeln name='COLUMN_1_34' seln='1|4|7|10|13|16|19|22|25|28|31|34' la_partage_seln='' type='S' payout='3.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='COLUMN_2_35' seln='2|5|8|11|14|17|20|23|26|29|32|35' la_partage_seln='' type='S' payout='3.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='COLUMN_3_36' seln='3|6|9|12|15|18|21|24|27|30|33|36' la_partage_seln='' type='S' payout='3.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_0_1_2_3' seln='0|1|2|3' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_10_11_13_14' seln='10|11|13|14' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_11_12_14_15' seln='11|12|14|15' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_13_14_16_17' seln='13|14|16|17' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_14_15_17_18' seln='14|15|17|18' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_16_17_19_20' seln='16|17|19|20' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_17_18_20_21' seln='17|18|20|21' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_19_20_22_23' seln='19|20|22|23' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_1_2_4_5' seln='1|2|4|5' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_20_21_23_24' seln='20|21|23|24' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_22_23_25_26' seln='22|23|25|26' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_23_24_26_27' seln='23|24|26|27' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_25_26_28_29' seln='25|26|28|29' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_26_27_29_30' seln='26|27|29|30' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_28_29_31_32' seln='28|29|31|32' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_29_30_32_33' seln='29|30|32|33' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_2_3_5_6' seln='2|3|5|6' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_31_32_34_35' seln='31|32|34|35' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_32_33_35_36' seln='32|33|35|36' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_4_5_7_8' seln='4|5|7|8' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_5_6_8_9' seln='5|6|8|9' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_7_8_10_11' seln='7|8|10|11' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='CORNER_8_9_11_12' seln='8|9|11|12' la_partage_seln='' type='S' payout='9.0000' min_stake='' max_stake='100.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='DOZEN_13_24' seln='13|14|15|16|17|18|19|20|21|22|23|24' la_partage_seln='' type='S' payout='3.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='DOZEN_1_12' seln='1|2|3|4|5|6|7|8|9|10|11|12' la_partage_seln='' type='S' payout='3.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='DOZEN_25_36' seln='25|26|27|28|29|30|31|32|33|34|35|36' la_partage_seln='' type='S' payout='3.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='OUTSIDE_BLACK' seln='2|4|6|8|10|11|13|15|17|20|22|24|26|28|29|31|33|35' la_partage_seln='' type='S' payout='2.0000' min_stake='' max_stake='500.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='OUTSIDE_EVEN' seln='2|4|6|8|10|12|14|16|18|20|22|24|26|28|30|32|34|36' la_partage_seln='' type='S' payout='2.0000' min_stake='' max_stake='500.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='OUTSIDE_HIGH' seln='19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36' la_partage_seln='' type='S' payout='2.0000' min_stake='' max_stake='500.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='OUTSIDE_LOW' seln='1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18' la_partage_seln='' type='S' payout='2.0000' min_stake='' max_stake='500.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='OUTSIDE_ODD' seln='1|3|5|7|9|11|13|15|17|19|21|23|25|27|29|31|33|35' la_partage_seln='' type='S' payout='2.0000' min_stake='' max_stake='500.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='OUTSIDE_RED' seln='1|3|5|7|9|12|14|16|18|19|21|23|25|27|30|32|34|36' la_partage_seln='' type='S' payout='2.0000' min_stake='' max_stake='500.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='PICK_1' seln='1' la_partage_seln='' type='E' payout='36.0000' min_stake='' max_stake='25.00' lifetime_type='T' payout_incr='0.00' />
			<BetSeln name='SIX_10_15' seln='10|11|12|13|14|15' la_partage_seln='' type='S' payout='6.0000' min_stake='' max_stake='150.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SIX_13_18' seln='13|14|15|16|17|18' la_partage_seln='' type='S' payout='6.0000' min_stake='' max_stake='150.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SIX_16_21' seln='16|17|18|19|20|21' la_partage_seln='' type='S' payout='6.0000' min_stake='' max_stake='150.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SIX_19_24' seln='19|20|21|22|23|24' la_partage_seln='' type='S' payout='6.0000' min_stake='' max_stake='150.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SIX_1_6' seln='1|2|3|4|5|6' la_partage_seln='' type='S' payout='6.0000' min_stake='' max_stake='150.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SIX_22_27' seln='22|23|24|25|26|27' la_partage_seln='' type='S' payout='6.0000' min_stake='' max_stake='150.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SIX_25_30' seln='25|26|27|28|29|30' la_partage_seln='' type='S' payout='6.0000' min_stake='' max_stake='150.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SIX_28_33' seln='28|29|30|31|32|33' la_partage_seln='' type='S' payout='6.0000' min_stake='' max_stake='150.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SIX_31_36' seln='31|32|33|34|35|36' la_partage_seln='' type='S' payout='6.0000' min_stake='' max_stake='150.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SIX_4_9' seln='4|5|6|7|8|9' la_partage_seln='' type='S' payout='6.0000' min_stake='' max_stake='150.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SIX_7_12' seln='7|8|9|10|11|12' la_partage_seln='' type='S' payout='6.0000' min_stake='' max_stake='150.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_0_1' seln='0|1' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_0_2' seln='0|2' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_0_3' seln='0|3' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_10_11' seln='10|11' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_10_13' seln='10|13' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_11_12' seln='11|12' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_11_14' seln='11|14' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_12_15' seln='12|15' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_13_14' seln='13|14' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_13_16' seln='13|16' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_14_15' seln='14|15' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_14_17' seln='14|17' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_15_18' seln='15|18' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_16_17' seln='16|17' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_16_19' seln='16|19' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_17_18' seln='17|18' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_17_20' seln='17|20' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_18_21' seln='18|21' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_19_20' seln='19|20' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_19_22' seln='19|22' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_1_2' seln='1|2' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_1_4' seln='1|4' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_20_21' seln='20|21' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_20_23' seln='20|23' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_21_24' seln='21|24' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_22_23' seln='22|23' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_22_25' seln='22|25' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_23_24' seln='23|24' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_23_26' seln='23|26' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_24_27' seln='24|27' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_25_26' seln='25|26' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_25_28' seln='25|28' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_26_27' seln='26|27' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_26_29' seln='26|29' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_27_30' seln='27|30' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_28_29' seln='28|29' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_28_31' seln='28|31' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_29_30' seln='29|30' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_29_32' seln='29|32' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_2_3' seln='2|3' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_2_5' seln='2|5' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_30_33' seln='30|33' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_31_32' seln='31|32' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_31_34' seln='31|34' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_32_33' seln='32|33' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_32_35' seln='32|35' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_33_36' seln='33|36' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_34_35' seln='34|35' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_35_36' seln='35|36' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_3_6' seln='3|6' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_4_5' seln='4|5' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_4_7' seln='4|7' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_5_6' seln='5|6' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_5_8' seln='5|8' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_6_9' seln='6|9' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_7_10' seln='7|10' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_7_8' seln='7|8' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_8_11' seln='8|11' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_8_9' seln='8|9' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='SPLIT_9_12' seln='9|12' la_partage_seln='' type='S' payout='18.0000' min_stake='' max_stake='50.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_0_1_2' seln='0|1|2' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_0_2_3' seln='0|2|3' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_10_11_12' seln='10|11|12' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_13_14_15' seln='13|14|15' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_16_17_18' seln='16|17|18' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_19_20_21' seln='19|20|21' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_1_2_3' seln='1|2|3' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_22_23_24' seln='22|23|24' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_25_26_27' seln='25|26|27' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_28_29_30' seln='28|29|30' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_31_32_33' seln='31|32|33' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_34_35_36' seln='34|35|36' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_4_5_6' seln='4|5|6' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
			<BetSeln name='STREET_7_8_9' seln='7|8|9' la_partage_seln='' type='S' payout='12.0000' min_stake='' max_stake='250.00' lifetime_type='T' payout_incr='0.00' mth_act='T' mth_no='1' />
		</BetPayout>
	</Init>

</GameResponse>

<?
	} else if(mb_strpos($postdata, 'BetState')!==false) {
		echo "<?xml version='1.0' encoding='UTF-8'?>";
?>
<!DOCTYPE GameResponse SYSTEM "http://www.orbisuk.com/igf/dtd/GameResponse.dtd">
<GameResponse>
	<Header>
		<GameId id='9166' ver='1' channel='I' />
		<Customer>
			<Account balance="996.00" held_funds="0.00" ccy_code="GBP" adjusted_free_balance="No" ccy_decimal_separator="." ccy_thousand_separator="," />
		</Customer>
	</Header>
	<Close />
	<Play stake="4.00" win="0.00" id="0" >
		<BetState drawn="<?php echo rand(0, 36); ?>" total_bets="2">
			<Bet name="PICK_1" stake="2.00" winnings="<?php echo ceil(rand(0, 1)); ?>.00" seln="5"/>
			<Bet name="SPLIT_25_26" stake="2.00" winnings="<?php echo ceil(rand(0, 1)); ?>.00" seln=""/>
		</BetState>
	</Play>
</GameResponse>
<?php
	} else {
		die('Error - invalid request data');
	}
} else {
	die('Error - no POST');
}


?>