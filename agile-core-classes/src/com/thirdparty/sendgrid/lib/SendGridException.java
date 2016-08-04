package com.thirdparty.sendgrid.lib;


public class SendGridException extends Exception {
    public SendGridException(Exception e) {
        super(e);
    }
}