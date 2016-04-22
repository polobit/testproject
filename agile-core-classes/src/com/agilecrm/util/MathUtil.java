package com.agilecrm.util;

public class MathUtil {
   public static int randomWithInRange(int min, int max){
	   int range = (max - min) + 1;
	   return (int) (Math.random() * range) + min;
   }
}
