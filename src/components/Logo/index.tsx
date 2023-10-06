import React from "react";

type LogoProps = {
  color?: string;
};

export default function Logo({ color = "#4467FB" }: LogoProps) {
  return (
    <svg
      width="104"
      height="36.4"
      viewBox="0 0 80 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.9201 8.32705C12.197 8.31607 13.4612 8.57936 14.6247 9.09865C15.7505 9.59826 16.7632 10.3159 17.6026 11.2089C18.4542 12.118 19.1221 13.1792 19.5703 14.3356C20.5106 16.8004 20.5106 19.5186 19.5703 21.9835C19.122 23.1406 18.4542 24.2028 17.6026 25.1131C16.7623 26.0053 15.7499 26.7227 14.6247 27.2234C13.4613 27.7437 12.1973 28.0086 10.9201 27.9998C9.81756 28.003 8.72394 27.8053 7.69422 27.4166C6.66771 27.0277 5.85934 26.5314 5.26911 25.9277L4.49919 27.5487H0V0.0455507H5.26911V10.3765C6.71955 9.01021 8.6032 8.32705 10.9201 8.32705ZM10.1948 23.3677C10.8611 23.3726 11.5202 23.2309 12.1241 22.953C12.7165 22.6813 13.2535 22.3049 13.7086 21.8424C14.1742 21.3717 14.5406 20.8145 14.7864 20.2031C15.2956 18.8997 15.2956 17.4561 14.7864 16.1528C14.5444 15.534 14.1777 14.9702 13.7086 14.4952C13.254 14.0318 12.7169 13.6549 12.1241 13.3832C11.5214 13.1023 10.8629 12.9575 10.1964 12.9593C9.54234 12.955 8.89155 13.0503 8.26702 13.2419C7.68255 13.4227 7.14715 13.7318 6.70099 14.1459C6.23009 14.6 5.87087 15.1545 5.65089 15.7669C5.37524 16.5602 5.24592 17.3959 5.26905 18.2342C5.25198 19.0106 5.38146 19.7834 5.65089 20.5131C5.87703 21.1114 6.23581 21.6523 6.70099 22.0962C7.15156 22.5134 7.68474 22.8341 8.26702 23.0382C8.88567 23.2556 9.53808 23.3646 10.1948 23.3603V23.3677ZM22.6823 0H27.9529V27.5442H22.6823V0ZM36.9251 27.5442H31.6561V8.8574H36.9252L36.9251 27.5442ZM34.2906 6.29278C33.9083 6.29684 33.5291 6.22554 33.1751 6.08308C32.8211 5.94061 32.4995 5.72984 32.2292 5.46312C31.9588 5.19641 31.7452 4.87912 31.6008 4.52986C31.4564 4.18061 31.3841 3.80641 31.3882 3.42923C31.3813 3.04869 31.4522 2.67069 31.5966 2.31779C31.7411 1.96488 31.9561 1.64431 32.2289 1.37519C32.4988 1.10666 32.82 0.893514 33.1739 0.748059C33.5277 0.602605 33.9073 0.527718 34.2906 0.527718C34.674 0.527718 35.0535 0.602605 35.4074 0.748059C35.7613 0.893514 36.0824 1.10666 36.3524 1.37519C36.6251 1.64431 36.8402 1.96489 36.9846 2.31779C37.129 2.6707 37.1999 3.0487 37.193 3.42923C37.1972 3.80643 37.1249 4.18065 36.9805 4.52993C36.8361 4.87922 36.6224 5.19653 36.3521 5.46327C36.0818 5.73001 35.7602 5.9408 35.4062 6.08328C35.0522 6.22576 34.6729 6.29684 34.2906 6.29278ZM50.7106 8.8574C51.5092 8.86882 52.3038 8.97077 53.0788 9.16127C54.0189 9.37897 54.8984 9.79938 55.6542 10.3923C56.41 10.9852 57.0234 11.7359 57.4502 12.5905C57.9717 13.5708 58.233 14.8394 58.234 16.3962V27.5442H52.9247V16.5782C52.9404 16.0736 52.8426 15.5719 52.6383 15.109C52.4657 14.7309 52.2013 14.4006 51.8685 14.1474C51.543 13.9056 51.1742 13.7268 50.7814 13.6202C50.3837 13.5087 49.9723 13.4519 49.5588 13.4515C49.1902 13.4566 48.8242 13.5134 48.4718 13.6202C48.0721 13.7357 47.6966 13.9209 47.3631 14.1671C47.0102 14.4306 46.7174 14.7645 46.5039 15.1471C46.2665 15.587 46.1482 16.08 46.1605 16.5782V27.5442H40.8962V8.8574H45.4031L46.1731 10.2884C46.8079 9.85016 47.5019 9.50187 48.2347 9.25375C49.0313 8.98433 49.8685 8.85031 50.7106 8.8574ZM72.0178 16.6193L80 27.5443H73.6994L68.6967 20.0847L66.8259 22.0746V27.5439H61.5552V0.0455507H66.8259V15.2974L72.9726 8.8574H79.3888L72.0178 16.6193Z"
        fill={color}
      ></path>
    </svg>
  );
}
