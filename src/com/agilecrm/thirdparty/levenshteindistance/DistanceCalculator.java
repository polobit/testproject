package com.agilecrm.thirdparty.levenshteindistance;

import java.util.List;

public interface DistanceCalculator
{

    public int computeShortestDistance();

    public String computeNearestWord() throws InvalidTypeException;

    public void addToCompareList(String compareWord);

    public void addToCompareList(List<String> compareList);

}
