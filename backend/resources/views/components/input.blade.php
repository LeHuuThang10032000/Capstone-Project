@props(['disabled' => false])

<input {{ $disabled ? 'disabled' : '' }} {!! $attributes->merge(['class' => 'rounded-md shadow-sm border focus:border-theme-300 focus:ring focus:ring-theme-200 focus:ring-opacity-50']) !!}>
